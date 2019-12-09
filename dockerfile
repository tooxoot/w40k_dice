FROM nginx:stable as release
WORKDIR /app
RUN chown nginx:nginx /var/cache/nginx
# USER nginx
COPY --chown=nginx:nginx ./dist/* ./
COPY --chown=nginx:nginx ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
