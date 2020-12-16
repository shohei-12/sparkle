Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      mount_devise_token_auth_for 'User', at: 'auth'
      get '/users/:id', to: 'users#show'
      put '/toggle-theme', to: 'users#toggle_theme'
      post '/records', to: 'records#create'
      get '/record', to: 'records#show'
      get '/records', to: 'records#index'
      put '/memos/:id/appearance', to: 'memos#update_appearance'
      put '/memos/:id/breakfast', to: 'memos#update_breakfast'
      put '/memos/:id/lunch', to: 'memos#update_lunch'
      put '/memos/:id/dinner', to: 'memos#update_dinner'
      put '/memos/:id/snack', to: 'memos#update_snack'
      get '/relationships/following/:id', to: 'relationships#following'
      resources :appearances
      resources :meals
      resources :memos
      resources :relationships, only: %i[create destroy]
      resources :likes, only: %i[create destroy]
    end
  end
end
