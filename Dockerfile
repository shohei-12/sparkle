FROM ruby:2.7.2
ENV TZ Asia/Tokyo
RUN apt-get update -qq && apt-get install -y --no-install-recommends \
  build-essential \
  nodejs \
  yarn \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*
RUN mkdir /sparkle
WORKDIR /sparkle
COPY Gemfile /sparkle/Gemfile
COPY Gemfile.lock /sparkle/Gemfile.lock
RUN bundle install
COPY . /sparkle
