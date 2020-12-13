module RelationshipsHelper
  def follow(data)
    post '/api/v1/relationships', params: data
  end

  def unfollow(user_id, token)
    delete "/api/v1/relationships/#{user_id}", headers: token
  end

  def following?(user_id, token)
    get "/api/v1/relationships/following/#{user_id}", headers: token
  end
end
