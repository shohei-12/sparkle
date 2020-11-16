require 'rails_helper'

RSpec.describe 'Api::V1::Users', type: :request do
  describe 'POST /api/v1/auth' do
    context 'when valid user' do
      let(:valid_user) do
        {
          name: 'test',
          email: 'test@example.com',
          password: 'password',
          password_confirmation: 'password'
        }
      end

      it 'sign up new user' do
        expect { post '/api/v1/auth', params: valid_user }.to change(User, :count).by(1)
        expect(response.status).to eq 200
      end
    end

    context 'when invalid user' do
      let(:invalid_user) do
        {
          name: '',
          email: 'test@example.com',
          password: 'password',
          password_confirmation: 'password'
        }
      end

      it 'do not sign up user' do
        expect { post '/api/v1/auth', params: invalid_user }.to change(User, :count).by(0)
        expect(response.status).to eq 422
      end
    end
  end
end
