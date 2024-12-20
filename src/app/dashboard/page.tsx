"use client"

import Canvas from '@/components/Canvas';
import PropertyPanel from '@/components/PropertyPanel';
import CommentsPanel from '@/components/CommentsPanel';
import { ToolboxItem } from '@/interfaces/ToolboxItem';
import { initGA, logPageView } from '@/utils/analytics';
import { ChakraProvider, Flex, Box, Button, VStack, Switch, FormControl, FormLabel } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';

import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Connection,
    Edge,
    MarkerType,
    Node,
} from 'react-flow-renderer';
import { v4 as uuidv4 } from 'uuid';

const GA_MEASUREMENT_ID = 'G-L5P6STB24E';

const HomePage: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [fullRelationship, setFullRelationship] = useState(false);
  const [programId, setProgramId] = useState<string>('');

  useEffect(() => {
    initGA(GA_MEASUREMENT_ID);
    logPageView();
  }, []);

  useEffect(() => {
  }, [nodes]);

  const onNodesChange = useCallback((changes: any) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: any) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  const handleSelectNode = (node: Node | null) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  };

  const handleSelectEdge = (edge: Edge | null) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  };

  const handleDeleteAll = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setSelectedEdge(null);
  };

  const handleDeleteNode = (id: string) => {
    setNodes(nodes.filter((node) => node.id !== id));
    setEdges(edges.filter((edge) => edge.source !== id && edge.target !== id));
    setSelectedNode(null);
  };

  const handleDeleteEdge = (id: string) => {
    setEdges(edges.filter((edge) => edge.id !== id));
    setSelectedEdge(null);
  };

  const handleUpdateNode = (updatedNode: Node) => {
    const oldNode = nodes.find((node) => node.id === updatedNode.id);
    const newOwnerProgramId = (updatedNode.data.localValues as any).ownerProgramId;
    const oldOwnerProgramId = oldNode && (oldNode.data.item as any).ownerProgramId;

    if (newOwnerProgramId !== oldOwnerProgramId) {
      if (oldOwnerProgramId) {
        setEdges(edges.filter((edge) => !(edge.source === oldOwnerProgramId && edge.target === updatedNode.id)));
      }
      if (newOwnerProgramId) {
        const newEdge: Edge = {
          id: uuidv4(),
          source: newOwnerProgramId,
          target: updatedNode.id,
          type: 'solana',
          animated: false,
          style: { stroke: '#ff0072', cursor: 'pointer', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.Arrow,
            color: '#ff0072',
            strokeWidth: 2,
          },
        };
        setEdges((edges) => [...edges, newEdge]);
      }
    }
    const item = updatedNode.data.item as ToolboxItem;
    item.setPropertyValues(updatedNode.data.localValues);
    setNodes(nodes.map((node) => (node.id === updatedNode.id ? updatedNode : node)));
    setSelectedNode(updatedNode);
  };

  const handleUpdateEdge = (updatedEdge: Edge) => {
    setEdges(edges.map((edge) => (edge.id === updatedEdge.id ? updatedEdge : edge)));
    setSelectedEdge(updatedEdge);
  };

  const handleAddNode = (newNode: Node) => {
    setNodes((nds) => [...nds, newNode]);
  };

  const handleNewSetOfNodes = (newNodes: Node[]) => {
    setNodes(newNodes);
  };

  const handleNewSetOfEdges = (newEdges: Edge[]) => { 
    setEdges(newEdges);
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  const handleToggleFullRelationship = () => {
    console.log('fullRelationship', fullRelationship);  
    setFullRelationship(!fullRelationship);
  };

    

  return (
    <ChakraProvider>
      <Flex direction='column' height='80vh' width='100vw'>
        <Box zIndex={10} position='absolute' top={20} left={4} p={4} bg='white' borderRadius='md' shadow='md'>
          <VStack spacing={4} align='stretch'>
            <Button colorScheme='blue' onClick={handleToggleComments}>
              {showComments ? 'Hide Comments' : 'Show Comments'}
            </Button>
            <FormControl display='flex' alignItems='center'>
              <FormLabel htmlFor='full-relationship' mb='0'>
                Full Relationship
              </FormLabel>
              <Switch id='full-relationship' isChecked={fullRelationship} onChange={handleToggleFullRelationship} />
            </FormControl>
          </VStack>
        </Box>
        <Flex height='100%' width='100%'>
          <Canvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onSelectNode={handleSelectNode}
            onSelectEdge={handleSelectEdge}
            onAddNode={handleAddNode}
            onDeleteAll={handleDeleteAll}   
            onNewSetOfNodes={handleNewSetOfNodes}
            onNewSetOfEdges={handleNewSetOfEdges}
            programId={programId}
            setProgramId={setProgramId}
            fullRelationship={fullRelationship}
          />
          <PropertyPanel
            selectedNode={selectedNode}
            selectedEdge={selectedEdge}
            onDeleteNode={handleDeleteNode}
            onDeleteEdge={handleDeleteEdge}
            onUpdateNode={handleUpdateNode}
            onUpdateEdge={handleUpdateEdge}
            programs={nodes.filter((node) => node.type === 'program')}
            nodes={nodes}
            programId={programId}
          />
          {showComments && <CommentsPanel programId={programId || ''} />}
        </Flex>
      </Flex>
    </ChakraProvider>
  );
};

export default HomePage;