require 'rails_helper'

RSpec.describe 'Api::V1::Auth::TokenValidations', type: :request do
  let(:user) { create(:user) }

  describe 'GET /api/v1/auth/validate_token' do
    context 'when token is valid' do
      before { @token = sign_in({ email: user.email, password: 'password' }) }

      it 'return current user' do
        get_current_user(@token)
        expect(response.status).to eq 200
        expect(JSON.parse(response.body)['data']['id']).to eq user.id
      end
    end

    context 'when token is invalid' do
      it 'return false' do
        get_current_user(nil)
        expect(response.status).to eq 401
        expect(JSON.parse(response.body)['success']).to eq false
      end
    end
  end
end
