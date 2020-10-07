# # Create your views here.
import simplejson
from django.core.serializers import serialize
from django.http import JsonResponse, HttpResponse
import plotly.graph_objects as go
from analytics.models import *
from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
from openpyxl import load_workbook, Workbook, worksheet
from openpyxl.worksheet.worksheet import Worksheet
from openpyxl.utils import get_column_letter
from django.core.exceptions import ObjectDoesNotExist


def pars_tags_list(request):
    """Получаем Excel файл из формы и заполняем базу тегами"""

    if request.method == 'POST':
        uploaded_file = request.FILES['excel-file']   # получаем содержимое из формы загрузки файлов "name="excel-file""

        wb = load_workbook(filename=uploaded_file, read_only=False)  # получаем excel файл
        ws = wb.active                                               # делаем лист активным в памяти

    """вычитываем имя группы тегов из каждой строки, пытаемся извлечь из базы имя группы
    соответствующее текущей строчке тега, если этого имени нет - пишем в базу соответствующее этого имени нет
    - пишем в базу соответствующее текущей строчке тега, если этого имени нет выпадает исключение. Обрабатываем сохраняя
    имя нруппы в таблицу Group"""

    for i in range(1, ws.max_row + 1):
        name_group = (ws.cell(row=i, column=6)).value  # присваиваем переменной name_group значение ячейки столбца group
        try:
            Group.objects.get(name_group=name_group)    # получаем из базы значение равное переменной name_group
        except ObjectDoesNotExist:                      # исключение если такого значения в базе нет
            save_set_of_groups = Group(name_group=name_group)   # сохраняем содержимое переменной name_group в базу
            save_set_of_groups.save()
        group = Group.objects.get(name_group=name_group)  # g-заносим в переменную объект группы для текущей записи тега
        # чтобы создать связь один ко многим с таблицей Tags
        name_tag = (ws.cell(row=i, column=1)).value  # выбираем ячейки из таблицы
        try:
            Tags.objects.get(name_tag=name_tag)
        except ObjectDoesNotExist:
            tag_table = (ws.cell(row=i, column=2)).value
            data_type = (ws.cell(row=i, column=3)).value
            address_tag = (ws.cell(row=i, column=4)).value
            comment_tag = (ws.cell(row=i, column=5)).value
            save_set_of_tags = Tags(group=group, name_tag=name_tag, tag_table=tag_table, data_type=data_type,
                                    address=address_tag, comment=comment_tag)
            save_set_of_tags.save()                                                   # сохраняем модель Tags

        fs = FileSystemStorage()
    group = Group.objects.all()
    tags = Tags.objects.all()
    comment = Tags.objects.all()
    return render(request, 'analytics/analytics.html', context={'plot_div': chart(), 'group': group, 'tags': tags,
                                                                'comment': comment}, )


def group_prepare(request):
    if request.method == 'POST':
        data = request.POST
        tags_list = []
        # tags_list = Tags.objects.filter(group=Group.objects.get(name_group=data.get('groupList')))
        for e in Tags.objects.filter(group=Group.objects.get(name_group=data.get('groupList'))):
            tags_list.append(e.name_tag)
        print(tags_list)
        # data = tags_list
        # print(JsonResponse(data, safe=False))
        # return JsonResponse(data, safe=False)
        data = {'response': tags_list}
        print(JsonResponse(data))
        return JsonResponse(data)


def tags_prepare(request):
    """Подготовка списка переменных и тегов для тренда"""
    if request.method == 'POST' and request.POST.get('done'):
        data = request.POST
        print(data)
        # date_time_before = data.get('date-time-before')
        # date_time_after = data.get('date-time-after')

        group = Group.objects.all()
        tags = Tags.objects.all()
        comment = Tags.objects.all()
        print('gotcha!!!!')
        print(type(group))
        return render(request, 'analytics/analytics.html', context={'plot_div': chart(), 'group': group, 'tags': tags,
                                                                    'comment': comment}, )


def analytics_render(request):
    """Отрисовка страницы"""
    group = Group.objects.all()
    tags = Tags.objects.all()
    comment = Tags.objects.all()
    return render(request, 'analytics/analytics.html', context={'plot_div': chart(), 'group': group, 'tags': tags,
                                                                'comment': comment}, )


def chart():
    """Создание тренда"""
    my_query_1 = [1, 10, 1, 10, 1, 10, 1, 10, 1, 10, 1, 10, 1, 10, 1, 10, 1, 10, 1]
    my_query_2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    # генератор точек для оси Х в соответствии с количеством точек оси У
    q = [i for i in range(1, len(my_query_1))]

    # рисуем график
    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=q, y=my_query_1,  # заполнение осей значениями
        name="yaxis1 data",  # лейбл
        yaxis="y1",
        fillcolor="#1f77b4"
    ))

    fig.add_trace(go.Scatter(
        x=q, y=my_query_2,
        name="yaxis2 data",
        yaxis="y2",
        fillcolor="#ff7f0e"
    ))
    #     #
    #     # fig.add_trace(go.Scatter(
    #     #     x=q, y=[0, 1, 0, 1, 0, 1, 0],
    #     #     name="yaxis3 data",
    #     #     yaxis="y3",
    #     #     fillcolor="#d62728"
    #     # ))
    #     #
    #     # fig.add_trace(go.Scatter(
    #     #     x=q, y=[0, 1, 0, 1, 0, 1, 0],
    #     #     name="yaxis4 data",
    #     #     yaxis="y4",
    #     #     fillcolor="#9467bd"
    #     # ))
    #
    # Create axis objects
    fig.update_layout(
        xaxis=dict(domain=[0.15, 1], rangeslider=dict(visible=True)),

        yaxis1=dict(title="yaxis1 title", titlefont=dict(color="#1f77b4"), tickfont=dict(color="#1f77b4"),
                    anchor="free", side="left", position=0.15),

        yaxis2=dict(title="yaxis2 title", titlefont=dict(color="#ff7f0e"), tickfont=dict(color="#ff7f0e"),
                    anchor="free", overlaying="y", side="left", position=0.1),
        #         #
        #         # yaxis3=dict(title="yaxis3 title", titlefont=dict(color="#d62728"), tickfont=dict(color="#d62728"),
        #         #             anchor="free", overlaying="y", side="left", position=0.05),
        #         #
        #         # yaxis4=dict(title="yaxis4 title", titlefont=dict(color="#9467bd"), tickfont=dict(color="#9467bd"),
        #         #             anchor="free", overlaying="y", side="left", position=0)
    )

    # Update layout properties
    fig.update_layout(title_text="multiple y-axes example", width=1800, )

    return fig.to_html('plot_div')
