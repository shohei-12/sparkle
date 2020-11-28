Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      mount_devise_token_auth_for 'User', at: 'auth'
      put '/toggle-theme', to: 'users#toggle_theme'
      post '/records', to: 'records#create'
      post '/appearances', to: 'appearances#create'
      post '/meals', to: 'meals#create'
      resources :users
    end
  end
end
