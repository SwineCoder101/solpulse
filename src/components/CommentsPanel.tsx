import React, { useState } from 'react';
import { Box, VStack, Text, IconButton, HStack } from '@chakra-ui/react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import useCommentCache from '@/hooks/useCommentCache';

interface CommentsPanelProps {
  programId: string;
}

const CommentsPanel: React.FC<CommentsPanelProps> = ({ programId }) => {
  const { getCommentsForProgram, updateComment } = useCommentCache(programId);
  const [showComments, setShowComments] = useState(false);

  const comments = getCommentsForProgram();

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  const handleThumbsUp = (index: number) => {
    const updatedComments = [...comments];
    updatedComments[index].thumbsUp += 1;
    updateComment(programId, updatedComments[index]);
  };

  const handleThumbsDown = (index: number) => {
    const updatedComments = [...comments];
    updatedComments[index].thumbsDown += 1;
    updateComment(programId, updatedComments[index]);
  };

  return (
    <Box width='900px' bg='gray.100' p={4} height={['100%', '80vh']}>
      <VStack spacing={4} align='stretch'>
        {!programId ? (
          <Text>Please enter a program ID.</Text>
        ) : comments.length === 0 ? (
          <Text>No comments available.</Text>
        ) : (
          comments.map((comment, index) => (
            <Box key={index} p={4} bg='white' borderRadius='md' shadow='md'>
              <Text fontSize='md' fontWeight='bold'>
                {comment.type} - {comment.name}
              </Text>
              <Text>{comment.comment}</Text>
              <Text fontSize='sm' color='gray.500'>
                {comment.walletAddress} - {new Date(comment.dateTime).toLocaleString()}
              </Text>
              <Text fontSize='sm'>
                Thumbs Up: {comment.thumbsUp} | Thumbs Down: {comment.thumbsDown}
              </Text>
              <HStack spacing={4}>
                <IconButton
                  aria-label='Thumbs Up'
                  icon={<FaThumbsUp />}
                  size='sm'
                  onClick={() => handleThumbsUp(index)}
                />
                <IconButton
                  aria-label='Thumbs Down'
                  icon={<FaThumbsDown />}
                  size='sm'
                  onClick={() => handleThumbsDown(index)}
                />
              </HStack>
            </Box>
          ))
        )}
      </VStack>
    </Box>
  );
};

export default CommentsPanel;