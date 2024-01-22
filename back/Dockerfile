FROM alpine:3.19

RUN apk update && \
    apk add g++ python3 py-pip git htop

RUN adduser llamauser --disabled-password

#Place your model in this folder
# VOLUME workspace/model

# Set the working directory inside the container
# Copy the application code and requirements file into the container
WORKDIR /workspace
ADD ./llama-server.py /workspace/llama-server.py
ADD ./requirements.txt /workspace/requirements.txt
ADD ./model/llama-2-7b-chat.Q4_K_M.gguf /workspace/model/llama-2-7b-chat.Q4_K_M.gguf

# Install the Python dependencies
RUN python3 -m venv ./llama-venv
RUN . ./llama-venv/bin/activate && pip install -r requirements.txt

ENV HOME=/workspace
EXPOSE 5000

USER llamauser

CMD [ "sh", "-c", "source /workspace/llama-venv/bin/activate && python3 /workspace/llama-server.py" ]