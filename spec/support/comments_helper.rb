module CommentsHelper
  def make_comment(data, token)
    post '/api/v1/comments', params: data, headers: token
  end

  def get_20_comments(record_id, target, data)
    get "/api/v1/comments/#{record_id}/#{target}", params: data
  end

  def get_10_reply_comments(comment_id, data)
    get "/api/v1/comments/#{comment_id}/reply/list", params: data
  end

  def delete_comment(id, token)
    delete "/api/v1/comments/#{id}", headers: token
  end
end
