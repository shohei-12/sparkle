require 'rails_helper'

RSpec.describe Comment, type: :model do
  let(:comment) { build(:comment) }

  it 'return true' do
    expect(comment.valid?).to eq true
  end

  describe 'user_id' do
    context 'when empty' do
      before { comment.user_id = '' }

      it 'return false' do
        expect(comment.valid?).to eq false
      end
    end

    context 'when user does not exist' do
      before { comment.user_id += 2 }

      it 'return false' do
        expect(comment.valid?).to eq false
      end
    end
  end

  describe 'record_id' do
    context 'when empty' do
      before { comment.record_id = '' }

      it 'return false' do
        expect(comment.valid?).to eq false
      end
    end

    context 'when record does not exist' do
      before { comment.record_id += 1 }

      it 'return false' do
        expect(comment.valid?).to eq false
      end
    end
  end

  describe 'target' do
    context 'when empty' do
      before { comment.target = '' }

      it 'return false' do
        expect(comment.valid?).to eq false
      end
    end

    context 'when not a specific value' do
      before { comment.target = 'hoge' }

      it 'return false' do
        expect(comment.valid?).to eq false
      end
    end
  end

  describe 'content' do
    context 'when empty' do
      before { comment.content = '' }

      it 'return false' do
        expect(comment.valid?).to eq false
      end
    end
  end
end
