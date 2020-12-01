require 'rails_helper'

RSpec.describe 'Api::V1::Users', type: :request do
  describe 'PUT /api/v1/toggle-theme' do
    before { @user = create(:user) }

    context 'when data is valid' do
      let(:valid_data) do
        {
          id: @user.id,
          theme: 'dark'
        }
      end

      it 'toggle theme' do
        toggle_theme(valid_data)
        expect(response.status).to eq 204
        @user.reload
        expect(@user.theme).to eq 'dark'
      end
    end

    context 'when data is invalid' do
      let(:invalid_data) do
        {
          id: @user.id,
          theme: 'darkk'
        }
      end

      it 'not toggle theme' do
        toggle_theme(invalid_data)
        expect(response.status).to eq 204
        @user.reload
        expect(@user.theme).to eq 'light'
      end
    end
  end
end
