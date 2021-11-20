FROM python:3.8.1

WORKDIR /e-donos

COPY . /e-donos

RUN pip install -r requirements.txt
RUN python3 manage.py makemigrations
RUN python3 manage.py migrate

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]


