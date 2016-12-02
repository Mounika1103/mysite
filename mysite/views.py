from vectorscient_toolkit.stats.clusters_stats import FullStatsCalculator
from vectorscient_toolkit.sources.data import CsvDataSource, DatabaseTableSource
from vectorscient_toolkit.sources.connection import DBConnection


import os
import sys
from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect, HttpResponse
from django.conf import settings
import csv
import os
import codecs
from tkinter import *
import tkinter.filedialog
from tkinter.filedialog import askdirectory
import mysql.connector
from mysql.connector import Error


def indexView(request):
    template_name = 'trials.html'
    context = {}
    #form = InputFileForm()
    #context['form'] = form
    return render(request, template_name, context)


def dataStatsView(request):
    template_name = 'datastats.html'
    context = {}

    if request.method == 'POST':

        if request.POST['form-type'] == "micro-form":
            file = request.FILES['inputfile']
            dictdata = csv.DictReader(codecs.iterdecode(file, 'ISO-8859-1'))
            fields = dictdata.fieldnames
            request.session['filename'] = file.name

            path = os.path.join(settings.MEDIA_ROOT+'/files/'+ request.session['filename'])
            request.session['file_source'] = path

            writer = csv.DictWriter(open(path, 'w+', encoding='ISO-8859-1'),delimiter=',', fieldnames=fields)
            writer.writeheader()
            for row in dictdata:
                writer.writerow(row)

            return render(request, template_name, {'x': fields, 'file': file})

        if request.POST['form-type'] == "blog-form":
            checkboxes = request.POST.getlist('configtabs')
            source = request.session['file_source']
            include = checkboxes
            request.session['include']  = include

            w = CsvDataSource(source)
            w.prepare()
            x = FullStatsCalculator(w, ignore=None, include=include)
            y = x.calculate_predictor_stats()

            return render(request, template_name, {'result':y.to_html(), 'attributes' : checkboxes})


        if request.POST['form-type'] == "save-as-csv":

            if request.POST.get('save_csv'):
                gui = Tk()
                gui.focus_force()
                gui.wm_attributes('-topmost', 1)
                dir = tkinter.filedialog.askdirectory()
                #button = tkinter.Button(gui, text='Select a directory to save file.. ', command=dir)
                #button.grid()
                gui.mainloop()


                saved_csv_filename = "Statistics_for_"+ request.session['filename']
                sourcepath = request.session['file_source']
                include = request.session['include']
                w = CsvDataSource(sourcepath)
                w.prepare()
                x = FullStatsCalculator(w, ignore=None, include=include)
                y = x.calculate_predictor_stats()
                saved_csv_fullname = os.path.join(dir,saved_csv_filename)
                y.to_csv(saved_csv_fullname, sep=',')
                return render(request, template_name, {'directory_f' : dir})

            if request.POST.get('table_save_csv'):
                gui = Tk()
                gui.focus_force()
                gui.wm_attributes('-topmost', 1)
                dir = tkinter.filedialog.askdirectory()
                # button = tkinter.Button(gui, text='Select a directory to save file.. ', command=dir)
                # button.grid()
                gui.mainloop()

                saved_csv_filename = "Statistics_for_" + request.session['selected_table']
                include = request.session['include_tablecolumns']
                host = request.session['host']
                db = request.session['db']
                username = request.session['username']
                password = request.session['password']
                source = request.session['selected_table']
                try:
                    conn = mysql.connector.connect(host=host,
                                                   database=db,
                                                   user=username,
                                                   password=password)
                    if conn.is_connected():
                        v = DBConnection(db, username=username, password=password, host=host)
                        w = DatabaseTableSource(source, v)
                        w.prepare()
                        x = FullStatsCalculator(w, ignore=None, include=include)
                        y = x.calculate_predictor_stats()
                        saved_csv_fullname = os.path.join(dir, saved_csv_filename)
                        y.to_csv(saved_csv_fullname, sep='\t', encoding='ISO-8859-1')


                except Error as e:
                    print(e)
                    context['error'] = e
                    context['erro_msg'] = "There's something wrong with the connection"

                return render(request, template_name, {'directory_t': dir})






        if request.POST['form-type'] == "db-form":
            context = {}
            tablenames = []
            host = request.POST['host']
            request.session['host']=host
            db = request.POST['db']
            request.session['db'] = db
            username = request.POST['username']
            request.session['username'] = username
            password = request.POST['password']
            request.session['password'] = password
            try:
                conn = mysql.connector.connect(host=host,
                                               database=db,
                                               user=username,
                                               password=password)
                if conn.is_connected():
                    context['conn'] = conn
                    context['success_msg'] = "connected to database"
                    sql = "show tables"
                    cursor = conn.cursor()
                    cursor.execute(sql)
                    tables= cursor.fetchall()
                    for (table_name,) in tables:
                        tablenames.append(table_name)

                    context['tablenames'] = tablenames


            except Error as e:
                print(e)
                context['error'] = e
                context['erro_msg'] = "There's something wrong with the connection"

            return render(request, template_name, context)


        if request.POST['form-type'] == "table-form":
            context = {}
            columns = []
            host = request.session['host']
            db  = request.session['db']
            username = request.session['username']
            password = request.session['password']
            table = request.POST.get('selecttable')
            context['selected_table'] = table
            request.session['selected_table'] = table
            request.session['table_source'] = table
            try:
                conn = mysql.connector.connect(host=host,
                                               database=db,
                                               user=username,
                                               password=password)
                if conn.is_connected():
                    cursor = conn.cursor()
                    cursor.execute("SELECT column_name FROM information_schema.columns WHERE  table_schema = '%s' AND table_name = '%s' " %(db,table))
                    for (column,) in cursor.fetchall():
                        columns.append(column)
                context['columnnames'] = columns

            except Error as e:
                print(e)
                context['error'] = e
                context['erro_msg'] = "There's something wrong with the connection"

            return render(request, template_name, context)

        if request.POST['form-type'] == "table-column-form":
            host = request.session['host']
            db = request.session['db']
            username = request.session['username']
            password = request.session['password']
            checkboxes = request.POST.getlist('selecttablecolumn')
            source = request.session['table_source']
            include = checkboxes
            request.session['include_tablecolumns'] = include
            try:
                conn = mysql.connector.connect(host=host,
                                               database=db,
                                               user=username,
                                               password=password)
                if conn.is_connected():
                    v = DBConnection(db, username=username, password = password, host = host)
                    w = DatabaseTableSource(source,v)
                    w.prepare()
                    x = FullStatsCalculator(w, ignore=None, include=include)
                    y = x.calculate_predictor_stats()


            except Error as e:
                print(e)
                context['error'] = e
                context['erro_msg'] = "There's something wrong with the connection"




            return render(request, template_name, {'result_from_table': y.to_html(), 'table_columns': checkboxes})

    return render(request, template_name, context)



def generateStatsView(request):
    template_name = 'showstats.html'
    context = {}

    if request.method == 'POST':
        checkboxes = request.POST.getlist('configtabs')
        context['boxes'] = checkboxes
        ignore = context['boxes']
        context['filename'] = request.session['file']
        context['filedata'] = request.session['filedata']
        d = request.session['filedata']

        fields = request.session['fields']

        with open("test.csv" , "w+") as f:
            wr = csv.writer(f, delimiter=',')
            wr.writerow(d)

        return render(request, template_name, context)

    return render(request, template_name, context)

