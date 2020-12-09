module MemoHelpers
  def save_memo(data)
    post '/api/v1/memos', params: data
  end

  def get_memo(data)
    get "/api/v1/memos/#{data}"
  end

  def update_appearance(memo_id, data)
    put "/api/v1/memos/#{memo_id}/appearance", params: data
  end

  def update_breakfast(memo_id, data)
    put "/api/v1/memos/#{memo_id}/breakfast", params: data
  end

  def update_lunch(memo_id, data)
    put "/api/v1/memos/#{memo_id}/lunch", params: data
  end

  def update_dinner(memo_id, data)
    put "/api/v1/memos/#{memo_id}/dinner", params: data
  end

  def update_snack(memo_id, data)
    put "/api/v1/memos/#{memo_id}/snack", params: data
  end
end
