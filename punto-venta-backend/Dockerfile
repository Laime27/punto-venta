FROM php:8.4-fpm

RUN apt-get update && apt-get install -y \
    git curl unzip libzip-dev libpng-dev libonig-dev libxml2-dev libicu-dev \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
        intl \
        sockets \
    && rm -rf /var/lib/apt/lists/*
    
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

RUN groupadd -g 1000 www && useradd -u 1000 -g www -m www
USER www

COPY docker/uploads.ini /usr/local/etc/php/conf.d/uploads.ini

EXPOSE 9000
CMD ["php-fpm"]