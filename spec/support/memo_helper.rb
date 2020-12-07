module MemoHelpers
  def save_memo(data)
    post '/api/v1/memos', params: data
  end
end
