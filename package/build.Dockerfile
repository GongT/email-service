RUN update-resolve && \
	apk add git && \
	cd package && \
	sh build.sh && \
	apk del git
