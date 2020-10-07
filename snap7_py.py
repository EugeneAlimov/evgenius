# from snap7 import client as cli
import snap7

client = snap7.client.Client()
client.create()
client.connect('192.168.0.101', 0, 1)
print(client)

# client.list_blocks()
# block_list.from_address()
client.plc_stop()

info = client.get_cpu_info()
print(info)
# client.upload('DB1')
