module RecordHelpers
  def save_record(data)
    post '/api/v1/records', params: data
  end

  def get_record(data)
    get '/api/v1/record', params: data
  end
end
