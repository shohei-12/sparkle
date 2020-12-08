Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      mount_devise_token_auth_for 'User', at: 'auth'
      put '/toggle-theme', to: 'users#toggle_theme'
      post '/records', to: 'records#create'
      get '/record', to: 'records#show'
      get '/records', to: 'records#index'
      resources :users
      resources :appearances
      resources :meals
      resources :memos
    end
  end
end
