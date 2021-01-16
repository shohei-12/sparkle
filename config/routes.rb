Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      mount_devise_token_auth_for 'User', at: 'auth'
      get '/users/:id', to: 'users#show'
      put '/toggle-theme', to: 'users#toggle_theme'
      get '/users/:id/followings', to: 'users#twenty_followings'
      get '/users/:id/followers', to: 'users#twenty_followers'
      post '/records', to: 'records#create'
      get '/record', to: 'records#show'
      get '/records', to: 'records#index'
      get '/users/:id/like-records', to: 'records#twenty_like_records'
      put '/memos/:id/appearance', to: 'memos#update_appearance'
      put '/memos/:id/breakfast', to: 'memos#update_breakfast'
      put '/memos/:id/lunch', to: 'memos#update_lunch'
      put '/memos/:id/dinner', to: 'memos#update_dinner'
      put '/memos/:id/snack', to: 'memos#update_snack'
      get '/relationships/following/:id', to: 'relationships#following?'
      get '/comments/:record_id/:target', to: 'comments#twenty_comments'
      get '/comments/:id/reply/list', to: 'comments#ten_reply_comments'
      resources :appearances
      resources :meals
      resources :memos
      resources :relationships, only: %i[create destroy]
      resources :likes, only: %i[create destroy]
      resources :comments, only: %i[create destroy]
    end
  end
end
