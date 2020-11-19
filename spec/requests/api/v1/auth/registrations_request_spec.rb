require 'rails_helper'

RSpec.describe 'Api::V1::Auth::Registrations', type: :request do
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
        expect { sign_up(valid_user) }.to change(User, :count).by(1)
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

    context 'when valid user' do
      let(:valid_user) do
        { name: 'user1 update', email: 'user1update@example.com' }
      end

      it 'update user' do
        update_user(valid_user, @token)
        @user1.reload
        expect(@user1.name).to eq 'user1 update'
        expect(@user1.email).to eq 'user1update@example.com'
        expect(response.status).to eq 200
      end
    end

    context 'when invalid user' do
      let(:invalid_user) do
        { name: '', email: '' }
      end

      it 'not update user' do
        update_user(invalid_user, @token)
        @user1.reload
        expect(@user1.name).to eq 'user1'
        expect(@user1.email).to eq 'user1@example.com'
        expect(response.status).to eq 422
      end
    end
  end
end
