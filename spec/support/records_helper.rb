module RecordsHelper
  def save_record(data, token)
    post '/api/v1/records', params: data, headers: token
  end

  def get_record(data)
    get '/api/v1/record', params: data
  end

  def get_20_records(data)
    get '/api/v1/records', params: data
  end

  def get_20_like_records(data, user_id)
    get "/api/v1/users/#{user_id}/like-records", params: data
  end

  def get_record_related(data, token)
    get '/api/v1/records/related', params: data, headers: token
  end

  def delete_images(data, token)
    delete '/api/v1/records/images/delete', params: data, headers: token
  end
end
