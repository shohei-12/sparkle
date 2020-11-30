require 'rails_helper'

RSpec.describe 'Api::V1::Auth::Sessions', type: :request do
  let(:user) { create(:user) }

  describe 'POST /api/v1/auth/sign_in' do
    context 'when user exists' do
      let(:exist_user) do
        {
          email: user.email,
          password: 'password'
        }
      end

      it 'sign in' do
        sign_in(exist_user)
        expect(response.status).to eq 200
      end
    end

    context 'when user does not exist' do
      let(:non_existent_user) do
        {
          email: user.email,
          password: 'passwor'
        }
      end

      it 'not sign in' do
        sign_in(non_existent_user)
        expect(response.status).to eq 401
      end
    end
  end

  describe 'DELETE /api/v1/auth/sign_out' do
    let(:token) do
      sign_in({
                email: user.email,
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
