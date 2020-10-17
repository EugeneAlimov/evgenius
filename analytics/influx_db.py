from datetime import datetime
from influxdb import InfluxDBClient
from analytics.views import tags_influx_prepare


bucket = "line"                                                                         # Имя базы данных
measurement = "line_process"                                                                     # Имя измерения
query_variable = [1, 2]


query_time = datetime.now()
# print(datetime.now())
# print(datetime.utcnow())

client = InfluxDBClient('localhost', 8086, 'root', 'root')                                    # Подключение к базе
client.create_database('line_exit')
# client.drop_database('line')
# list_database = client.get_list_database()

# list_measure = client.get_list_measurements()
client.switch_database(bucket)                                                             # Переключение на нужную базу

# print(list_database)
# print(list_measure)

query = f'SELECT "Int_1", "Int_2", "Real_1" FROM {bucket}."autogen".{measurement} WHERE time > now() - 1h'
result = client.query(query)
print(result)




















