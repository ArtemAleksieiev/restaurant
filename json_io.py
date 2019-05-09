#!flask/bin/python

import sys
import os

from flask import Flask, render_template, request, redirect, url_for, Response
from geopy.geocoders import Nominatim
import random, json
import datetime

app = Flask(__name__)

app.config['UPLOAD_FOLDER'] = 'static/img'

path = 'static'
fileName = 'restaurants'

@app.route('/')
def output():
	return render_template('index.html')

@app.route('/restaurant', methods=['GET', 'POST'])
def postRestaurant():
	if request.method == 'POST':
		name = request.form['name']
		now = datetime.datetime.now()
		date = unicode(now.replace(microsecond=0))
		comments = request.form['comments']
		data1 = {"name": name, "date": date, "rating": 4, "comments": comments}
		id = request.args.get("id")
		writeToJSONFile(path, fileName, writeReview(readFromJSONFile(path, fileName), data1, id))
		return render_template('restaurant.html')
	else:
		id = request.args.get("id")
		rtg = ratingRestourant(readFromJSONFile(path, fileName), id)
		writeToJSONFile(path, 'example', rtg)
		return render_template('restaurant.html', rtg = rtg)

@app.route('/admin', methods=['GET', 'POST'])
def newRestourant():
	if request.method == 'POST':
		if "new_restaurant" in request.form:
			restaurant_name = request.form['restaurant_name']
			address = request.form['adress']
			geolocator = Nominatim(user_agent="json_io.py")
			location = geolocator.geocode(address, timeout=None)
			boro = request.form['boro']
			if location is None:
				lat = 40.722216
				lng = -73.722216
			else:
				lat = location.latitude
				lng = location.longitude
			cuisine = request.form['cuisine']
			operating_hours = {"Monday": request.form['mon'], "Tuesday": request.form['tue'], "Wednesday": request.form['wed'], "Thursday": request.form['thu'], "Friday": request.form['fri'], "Saturday": request.form['sat'], "Sunday": request.form['sun']}
			file = request.files['image']
			f = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
			file.save(f)

			json_nr = readFromJSONFile(path, fileName)
			id = len(json_nr['restaurants'])+1
			newResObj = {
					'id': id,
					'name': restaurant_name,
					"neighborhood": boro,
					"photograph": file.filename,
					"address": address,
					"latlng": { "lat": lat, "lng": lng },
					"cuisine_type": cuisine,
					"operating_hours": operating_hours,
					"reviews": []
					}
			json_nr['restaurants'].append(newResObj)
			writeToJSONFile(path, fileName, json_nr)
			return redirect (url_for('output'))
		elif "delete_restaurant" in request.form:
			delete_name = request.form['names']
			writeToJSONFile(path, fileName, deleteRestaurant(readFromJSONFile(path, fileName), delete_name))
			return redirect (url_for('output'))
	else:
		return render_template('admin.html')

def readFromJSONFile(path, fileName):
    filePathNameRExt = './' + path + '/' + fileName + '.json'
    with open(filePathNameRExt, 'r') as f:
		json_load = json.load(f)
		return json_load

def deleteRestaurant(json_del, delete_name):
	id_num = 1
	for i in json_del['restaurants']:
		if i['name'] == delete_name:
			json_del['restaurants'].remove(i)
			for j in json_del['restaurants']:
				j['id'] = id_num
				id_num = id_num + 1
			return json_del

def ratingRestourant(json_rate, id):
	average = 0
	for i in json_rate['restaurants']:
		if str(i['id']) == id and i['reviews']:
			for j in i['reviews']:
				average = average + j['rating']
			average = float(average)/len(i['reviews'])
			return round(average,1)
	return 0



def writeReview(json_rv, data, id):
	for i in json_rv['restaurants']:
		if str(i['id']) == id:
			i['reviews'].insert(0,dict(data))
			return json_rv

def writeToJSONFile(path, fileName, data):
    filePathNameWExt = './' + path + '/' + fileName + '.json'
    with open(filePathNameWExt, 'w') as fp:
        json.dump(data, fp)

if __name__ == '__main__':
	app.run("0.0.0.0", "8000")
