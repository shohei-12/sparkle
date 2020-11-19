require 'rails_helper'

RSpec.describe 'Api::V1::Auth::Registrations', type: :request do
  describe 'POST /api/v1/auth' do
    context 'when user is valid' do
      let(:valid_user) do
        {
          name: 'test',
          email: 'test@example.com',
          password: 'password',
          password_confirmation: 'password'
        }
      end

      it 'sign up new user' do
        expect { sign_up(valid_user) }.to change(User, :count).by(1)
        expect(response.status).to eq 200
      end
    end

    context 'when user is invalid' do
      let(:invalid_user) do
        {
          name: '',
          email: 'test@example.com',
          password: 'password',
          password_confirmation: 'password'
        }
      end

      it 'do not sign up user' do
        expect { sign_up(invalid_user) }.to change(User, :count).by(0)
        expect(response.status).to eq 422
      end
    end
  end

  describe 'PUT /api/v1/auth' do
    before do
      @user1 = create(:user1)
      @token = sign_in({ email: @user1.email, password: 'password' })
    end

    context 'when user is valid' do
      let(:valid_data) do
        {
          name: 'user1update',
          email: 'user1update@example.com',
          password: 'passwordupdate',
          password_confirmation: 'passwordupdate',
          current_password: 'password'
        }
      end

      it 'update user' do
        update_user(valid_data, @token)
        expect(response.status).to eq 200
        @user1.reload
        expect(@user1.name).to eq 'user1update'
        expect(@user1.email).to eq 'user1update@example.com'
        expect(sign_in({ email: 'user1update@example.com', password: 'passwordupdate' })).to be_truthy
        expect(response.status).to eq 200
      end
    end

    context 'when user is invalid' do
      let(:invalid_data) do
        {
          name: '',
          email: '',
          password: '',
          password_confirmation: '',
          current_password: ''
        }
      end

      it 'not update user' do
        update_user(invalid_data, @token)
        expect(response.status).to eq 422
        @user1.reload
        expect(@user1.name).to eq 'user1'
        expect(@user1.email).to eq 'user1@example.com'
        expect(sign_in({ email: 'user1@example.com', password: 'password' })).to be_truthy
        expect(response.status).to eq 200
      end
    end
  end

  describe 'DELETE /api/v1/auth' do
    before do
      @user1 = create(:user1)
      @token = sign_in({ email: @user1.email, password: 'password' })
    end

    context 'when token is valid' do
      it 'delete user' do
        expect { delete_user(@token) }.to change(User, :count).by(-1)
        expect(response.status).to eq 200
      end
    end

    context 'when token is invalid' do
      before { @token['access_token'] = 'invalid' }

      it 'not delete user' do
        expect { delete_user(@token) }.to change(User, :count).by(0)
        expect(response.status).to eq 404
      end
    end
  end
end
