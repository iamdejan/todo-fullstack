FROM python:3.12.6

WORKDIR /app

COPY requirements.txt /app/requirements.txt

RUN pip3 install -r requirements.txt

COPY ./ /app/

CMD [ "fastapi", "dev", "main.py" ]
