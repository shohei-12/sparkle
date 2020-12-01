require 'rails_helper'

RSpec.describe 'Api::V1::Auth::Registrations', type: :request do
  let(:image) { Rack::Test::UploadedFile.new(Rails.root.join('spec/fixtures/test.jpg'), 'image/jpeg') }

  describe 'POST /api/v1/auth' do
    context 'when user is valid' do
      let(:valid_user) do
        {
          profile: image,
          name: 'test',
          email: 'test@example.com',
          password: 'password',
          password_confirmation: 'password',
          theme: 'light'
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
          password_confirmation: 'password',
          theme: 'light'
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
      @user = create(:user)
      @token = sign_in({ email: @user.email, password: 'password' })
    end

    context 'when user is valid' do
      let(:valid_data) do
        {
          profile: image,
          name: 'testupdate',
          email: 'testupdate@example.com',
          password: 'passwordupdate',
          password_confirmation: 'passwordupdate',
          current_password: 'password'
        }
      end

      it 'update user' do
        update_user(valid_data, @token)
        expect(response.status).to eq 200
        @user.reload
        expect(@user.profile_identifier).to eq 'test.jpg'
        expect(@user.name).to eq 'testupdate'
        expect(@user.email).to eq 'testupdate@example.com'
        expect(sign_in({ email: 'testupdate@example.com', password: 'passwordupdate' })).to be_truthy
        expect(response.status).to eq 200
      end
    end

    context 'when user is invalid' do
      let(:invalid_data) do
        {
          profile: image,
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
        @user.reload
        expect(@user.profile_identifier).to eq nil
        expect(@user.name).to eq 'test'
        expect(@user.email).to eq @user.email
        expect(sign_in({ email: @user.email, password: 'password' })).to be_truthy
        expect(response.status).to eq 200
      end
    end
  end

  describe 'DELETE /api/v1/auth' do
    before do
      @user = create(:user)
      @token = sign_in({ email: @user.email, password: 'password' })
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
