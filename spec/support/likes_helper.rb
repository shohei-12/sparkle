module LikesHelper
  def like(data)
    post '/api/v1/likes', params: data
  end

  def unlike(record_id, token)
    delete "/api/v1/likes/#{record_id}", headers: token
  end
end
