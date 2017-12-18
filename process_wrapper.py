import pika
from process_temps import process_temps
import json

# TODO make env var
connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()

# TODO learn pika API, see what we can do here
channel.queue_declare(queue='parameters')
channel.queue_declare(queue='results')

def callback(ch, method, properties, body):
  requestParams = json.loads(body.decode('utf-8'))
  days_window = int(requestParams[0])
  max_temperature = int(requestParams[1])
  results = process_temps(days_window, max_temperature)
  # send a message back
  print(results.to_json())
  channel.basic_publish(exchange='', routing_key='results', body=results.to_json())

# TODO figure out how to make this resilient to errors, etc.
channel.basic_consume(callback, queue='parameters', no_ack=True)
channel.start_consuming()
