Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      mount_devise_token_auth_for 'User', at: 'auth'
      post '/records', to: 'records#create'
      post '/appearances', to: 'appearances#create'
      resources :users
    end
  end
end
