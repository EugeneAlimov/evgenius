from pymongo import MongoClient
import datetime as dt
from bson import ObjectId


client = MongoClient('mongodb://localhost:27017/')  # подключение к серверу базы данных
collect_name = client.list_database_names()
print(collect_name)
db = client['test-collection']                      # получениие экземпляра базы данных
collection = db['test-collection']                  # получение списка имён документов
test_collection = db['test-collection']             # получение нужного документа


my_query_1 = []                                                 # массив значений для графика 1
my_query_2 = []                                                 # массив значений для графика 2
my_query_3 = []
date_load = (dt.datetime.now() - dt.timedelta(hours=2, minutes=1))
print(date_load)
dummy_id = ObjectId.from_datetime(date_load)                    # период времени выборки
print(dummy_id)
# print(test_collection.find_one())

# # заполняем массивы значениями
for i in test_collection.find({"_id": {"$gt": dummy_id}}):                     #gte lte
    print(i)
    my_query_1.append(i["Int_1"])
    my_query_2.append(i["Int_2"])
print(my_query_1)

