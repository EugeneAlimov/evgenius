import plotly.graph_objects as go
# from mongo_db import *

my_query_1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
my_query_2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
# генератор точек для оси Х в соответствии с количеством точек оси У
q = [i for i in range(1, len(my_query_1))]

# рисуем график
fig = go.Figure()
fig.add_trace(go.Scatter(
    x=q, y=my_query_1,          # заполнение осей значениями
    name="yaxis1 data"          # лейбл
))

fig.add_trace(go.Scatter(
    x=q, y=my_query_2,
    name="yaxis2 data",
    yaxis="y2"
))

# fig.add_trace(go.Scatter(
#     x=[1, 2, 3, 4, 5, 6, 7], y=[0, 1, 0, 1, 0, 1, 0],
#     name="yaxis3 data", 0 Ё

#     yaxis="y
# ))
#
# fig.add_trace(go.Scatter(
#     x=[1, 2, 3, 4, 5, 6, 7], y=[0, 1, 0, 1, 0, 1, 0],
#     name="yaxis4 data",
#     yaxis="y4"
# ))

# Create axis objects
fig.update_layout(
    xaxis=dict(domain=[0.15, 1], rangeslider=dict(visible=True)),

    yaxis=dict(title="yaxis title", titlefont=dict(color="#1f77b4"), tickfont=dict(color="#1f77b4")),

    yaxis2=dict(title="yaxis2 title", titlefont=dict(color="#ff7f0e"), tickfont=dict(color="#ff7f0e"),
                anchor="free", overlaying="y", side="left", position=0.1)

    # yaxis3=dict(title="yaxis3 title", titlefont=dict(color="#d62728"), tickfont=dict(color="#d62728"),
    #             anchor="free", overlaying="y", side="left", position=0.05),
    #
    # yaxis4=dict(title="yaxis4 title", titlefont=dict(color="#9467bd"), tickfont=dict(color="#9467bd"),
    #             anchor="free", overlaying="y", side="left", position=0)
)

# Update layout properties
fig.update_layout(title_text="multiple y-axes example", width=1800, )

fig.show()
