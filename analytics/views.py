# # Create your views here.
from django.http import JsonResponse, HttpResponse
import plotly.graph_objects as go
from analytics.models import *
from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
from openpyxl import load_workbook, Workbook, worksheet
from openpyxl.worksheet.worksheet import Worksheet
from openpyxl.utils import get_column_letter
from django.core.exceptions import ObjectDoesNotExist
from influxdb import InfluxDBClient
from datetime import datetime as dt, timedelta


def pars_tags_list(request):
    """Получаем Excel файл из формы и заполняем базу тегами"""

    if request.method == 'POST':
        uploaded_file = request.FILES['excel-file']  # получаем содержимое из формы загрузки файлов "name="excel-file""
        wb = load_workbook(filename=uploaded_file, read_only=False)  # получаем excel файл
        ws = wb.active  # делаем лист активным в памяти

    """вычитываем имя группы тегов из каждой строки, пытаемся извлечь из базы имя группы
    соответствующее текущей строчке тега, если имя группы есть - пишем в базу соответствующие теги, привязанные к этой
    группе соотношением один-комногим, если этого имени нет выпадает исключение. Обрабатываем сохраняя
    имя нруппы в таблицу Group и пишем в базу соответствующие теги, привязанные к этой 
    группе соотношением один-комногим
    Если файл с тегами не содержит нужные данные (пустые колонки или ячейки (кроме комментариев)) вывести уведомление 
    об этом"""

    for i in range(1, ws.max_row + 1):
        name_group = (ws.cell(row=i, column=6)).value  # присваиваем переменной name_group значение ячейки столбца group
        try:
            Group.objects.get(name_group=name_group)  # получаем из базы значение равное переменной name_group
        except ObjectDoesNotExist:  # исключение если такого значения в базе нет
            save_set_of_groups = Group(name_group=name_group)  # сохраняем содержимое переменной name_group в базу
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
            save_set_of_tags.save()  # сохраняем модель Tags

        fs = FileSystemStorage()
    group = Group.objects.all()
    tags = Tags.objects.all()
    comment = Tags.objects.all()
    return render(request, 'analytics/analytics.html', context={'plot_div': chart(), 'group': group, 'tags': tags,
                                                                'comment': comment}, )


def group_prepare(request):
    """Принимаем AJAX от клиента с названием группы по которой нужно вывести список тегов и комментариев
    принадлежащих к этой группе, фильтруем и создаем словарь с парами имя - комментарий"""
    if request.method == 'POST':
        data = request.POST
        tags_comments_list = {}
        for e in Tags.objects.filter(group=Group.objects.get(name_group=data.get('groupList'))):
            tags_comments_list[e.name_tag] = str(e.comment)
            data = tags_comments_list
        return JsonResponse(data)


def tags_influx_prepare(request):
    """Подготовка списка переменных и тегов для тренда"""

    if request.method == 'POST':
        influx_data = request.POST
        print(influx_data)

        influx_query_tags = influx_data.get('list')
        influx_query_tags = ','.join('"{0}"'.format(w) for w in influx_query_tags.split(','))  # генератор списка тегов
        print('influx_query_tags ', influx_query_tags)  # для query

        time_before = influx_data.get('dateTimeFrom')  # получаем timeFrom в виде строки
        time_before = dt.strptime(time_before, '%Y-%m-%d %H:%M:%S')  # делаем объект datetime
        time_before = time_before - timedelta(hours=2)  # получаем время в UTC потому что influx ставит время в нем

        time_after = influx_data.get('dateTimeAfter')  # получаем timeFrom в виде строки
        time_after = dt.strptime(time_after, '%Y-%m-%d %H:%M:%S')  # делаем объект datetime
        time_after = time_after - timedelta(hours=2)  # получаем время в UTC потому что influx ставит время в нем

        # print('influx_query_tags ', influx_query_tags)

        bucket = "line"  # Имя базы данных
        measurement = "line"  # Имя измерения

        client = InfluxDBClient('localhost', 8086, 'root', 'root')  # Подключение к базе. В будущем нужно сделать шаблон
        # внесения настроек подключения к базе. Создать модель с настройками и делать из нее выборку
        list_database = client.get_list_database()  # Список баз данных
        client.switch_database(bucket)  # Переключение на нужную базу

        query = f'SELECT {influx_query_tags} FROM {bucket}."autogen".{measurement} ' \
                f'WHERE time >= \'{time_before}\' AND time < \'{time_after}\''  # Запрос в Influx
        print('query= ', query)

        result = client.query(query)
        print(result)

        response = {'fsdf': 'fdsfr'}
        return JsonResponse(response, safe=False)
        # group = Group.objects.all()
        # tags = Tags.objects.all()
        # comment = Tags.objects.all()
        # return render(request, 'analytics/analytics.html', context={'plot_div': chart(), 'group': group, 'tags': tags,
        #                                                             'comment': comment}, )


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

# def category_adding(request):
#     if request.method == 'POST':
#         hujata = request.POST
#         form_name = hujata.get('huname')
#         print(hujata, form_name)
#         hujata = {'response': 'from django'}
#     return JsonResponse(hujata)
