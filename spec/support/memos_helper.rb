module MemosHelper
  def save_memo(data)
    post '/api/v1/memos', params: data
  end

  def get_memo(data)
    get "/api/v1/memos/#{data}"
  end

  def update_memo(record_id, data, token)
    put "/api/v1/memos/#{record_id}", params: data, headers: token
  end
end
