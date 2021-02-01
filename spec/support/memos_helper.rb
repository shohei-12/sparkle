module MemosHelper
  def add_memo(data, token)
    post '/api/v1/memos', params: data, headers: token
  end

  def get_memo(data)
    get "/api/v1/memos/#{data}"
  end

  def update_memo(record_id, data, token)
    put "/api/v1/memos/#{record_id}", params: data, headers: token
  end
end
