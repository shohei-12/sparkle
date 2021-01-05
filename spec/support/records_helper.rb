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
end
