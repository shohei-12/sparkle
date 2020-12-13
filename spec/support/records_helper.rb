module RecordsHelper
  def save_record(data)
    post '/api/v1/records', params: data
  end

  def get_record(data)
    get '/api/v1/record', params: data
  end

  def get_20records(data)
    get '/api/v1/records', params: data
  end
end