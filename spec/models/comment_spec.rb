require 'rails_helper'

RSpec.describe Comment, type: :model do
  let(:comment1) { build(:comment) }
  let(:comment2) { create(:comment) }
  let(:comment3) { create(:comment) }

  it 'return true' do
    expect(comment1.valid?).to eq true
  end

  describe 'user_id' do
    context 'when empty' do
      before { comment1.user_id = '' }

      it 'return false' do
        expect(comment1.valid?).to eq false
      end
    end

    context 'when user does not exist' do
      before { comment1.user_id += 2 }

      it 'return false' do
        expect(comment1.valid?).to eq false
      end
    end
  end

  describe 'record_id' do
    context 'when empty' do
      before { comment1.record_id = '' }

      it 'return false' do
        expect(comment1.valid?).to eq false
      end
    end

    context 'when record does not exist' do
      before { comment1.record_id += 1 }

      it 'return false' do
        expect(comment1.valid?).to eq false
      end
    end
  end

  describe 'target' do
    context 'when empty' do
      before { comment1.target = '' }

      it 'return false' do
        expect(comment1.valid?).to eq false
      end
    end

    context 'when not a specific value' do
      before { comment1.target = 'hoge' }

      it 'return false' do
        expect(comment1.valid?).to eq false
      end
    end
  end

  describe 'content' do
    context 'when empty' do
      before { comment1.content = '' }

      it 'return false' do
        expect(comment1.valid?).to eq false
      end
    end
  end

  describe '#self.get_comment_infos(comments)' do
    context 'when comments exists' do
      it 'get comment infos' do
        comments = [comment2, comment3]
        comment_infos = described_class.get_comment_infos(comments)
        comments.each_with_index do |comment, index|
          reply_count = described_class.where(reply_comment_id: comment.id).length
          str = comment.created_at.strftime('%Y-%m-%d')
          expect(comment_infos[index][:comment_id]).to eq comment.id
          expect(comment_infos[index][:author_id]).to eq comment.user_id
          expect(comment_infos[index][:author_profile]).to eq comment.user.profile
          expect(comment_infos[index][:author_name]).to eq comment.user.name
          expect(comment_infos[index][:content]).to eq comment.content
          expect(comment_infos[index][:created_at]).to eq str
          expect(comment_infos[index][:reply_count]).to eq reply_count
        end
      end
    end

    context 'when comments does not exist' do
      it 'not get comment infos' do
        expect(described_class.get_comment_infos([])).to eq []
      end
    end
  end
end
