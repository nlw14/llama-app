FROM alpine:3.19

RUN apk update && \
    apk add g++ python3 py-pip git htop

RUN adduser llamauser --disabled-password
ENV HOME=/home/llamauser

WORKDIR ${HOME}/workspace
ADD llama-server.py requirements.txt gunicorn_config.py .env ${HOME}/workspace/

RUN python3 -m venv ./llama-venv
RUN . ./llama-venv/bin/activate && pip install -r requirements.txt

EXPOSE 5000

USER llamauser

CMD [ "sh", "-c", "source ${HOME}/workspace/llama-venv/bin/activate && gunicorn --config gunicorn_config.py --log-level debug llama-server:app" ]