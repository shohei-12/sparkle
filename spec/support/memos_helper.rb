module MemosHelper
  def save_memo(data)
    post '/api/v1/memos', params: data
  end

  def get_memo(data)
    get "/api/v1/memos/#{data}"
  end
end
