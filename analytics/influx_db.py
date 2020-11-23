from datetime import datetime
from influxdb import InfluxDBClient

bucket = "line"                                                                         # Имя базы данных
measurement = "line"                                                                     # Имя измерения
query_variable = [1, 2]


# query_time = datetime.now()
# print(datetime.now())
# print(datetime.utcnow())

client = InfluxDBClient('localhost', 8086, 'root', 'root')                                    # Подключение к базе
# client.create_database('line')
# client.drop_database('line')
list_database = client.get_list_database()

# list_measure = client.get_list_measurements()
client.switch_database(bucket)                                                             # Переключение на нужную базу

# print(list_database)
# print(list_measure)

query = f'SELECT "pnIN_ConveyorRunning" FROM {bucket}."autogen".{measurement} WHERE time < now() - 1m'
# query = f'SELECT "time_pulse", "Clock_0.5Hz", "pnIN_ConveyorRunning" FROM {bucket}."autogen".{measurement} WHERE time' \
#         f'>= \'2020-10-19T17:42:16.718260Z\' AND time < \'2020-10-19T17:46:16.873558Z\''
result = client.query(query)
print(result)
# 2020-10-19 00:00:00
# 2020-10-19 00:08:48
# 2020-10-19T14:40:46.208047Z

















