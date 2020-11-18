require 'rails_helper'

RSpec.describe 'Api::V1::Auth::Sessions', type: :request do
  before { create(:user1) }

  describe 'POST /api/v1/auth/sign_in' do
    context 'when user exist' do
      let(:user) do
        {
          email: 'user1@example.com',
          password: 'password'
        }
      end

      it 'sign in' do
        sign_in(user)
        expect(response.status).to eq 200
      end
    end

    context 'when user not exist' do
      let(:user) do
        {
          email: 'user1@example.com',
          password: 'passwor'
        }
      end

      it 'not sign in' do
        sign_in(user)
        expect(response.status).to eq 401
      end
    end
  end

  describe 'DELETE /api/v1/auth/sign_out' do
    let(:token) do
      sign_in({
                email: 'user1@example.com',
                password: 'password'
              })
    end

    context 'when token is valid' do
      it 'sign out' do
        sign_out(token)
        expect(response.status).to eq 200
      end
    end

    context 'when token is invalid' do
      before { token['access_token'] = 'invalid' }

      it 'not sign out' do
        sign_out(token)
        expect(response.status).to eq 404
      end
    end
  end
end
