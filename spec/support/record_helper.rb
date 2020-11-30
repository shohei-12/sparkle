module RecordHelpers
  def save_record(data)
    post '/api/v1/records', params: data
  end
end
