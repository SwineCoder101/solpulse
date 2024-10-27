import getAccountInfo from '@/utils/getAccountInfo';
import getAnchorIDL from '@/utils/getAnchorIDL';
import getCreatedAccounts from '@/utils/getCreatedAccounts';
import { InstructionDTO, ProgramDTO, TypeDTO, parseProgram } from '@/utils/idleParser';
import shortenAddress from '@/utils/shortenAddress';
import { Box, Button, Flex, Input } from '@chakra-ui/react';
import { useConnection } from '@solana/wallet-adapter-react';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import ReactFlow, { Background, Connection, Controls, Edge, MarkerType, Node, NodeTypes } from 'react-flow-renderer';
import { createItem, getNodeTypes } from '../utils/itemFactory';
import CustomEdge from './CustomEdge';

interface CanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection) => void;
  onSelectNode: (node: Node | null) => void;
  onSelectEdge: (edge: Edge | null) => void;
  onAddNode: (node: Node) => void;
  onDeleteAll: () => void;
  onNewSetOfNodes: (nodes: Node[]) => void;
  onNewSetOfEdges: (edges: Edge[]) => void;
  programId: string;
  setProgramId: (programId: string) => void;
  fullRelationship: boolean;
}

const edgeTypes = {
  solana: CustomEdge,
};

const Canvas: React.FC<CanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onSelectNode,
  onSelectEdge,
  onAddNode,
  onDeleteAll,
  onNewSetOfNodes,
  onNewSetOfEdges,
  programId,
  setProgramId,
  fullRelationship,
}) => {

  const canvasRef = useRef<HTMLDivElement>(null);
  const { connection } = useConnection();

  // Memoize nodeTypes
  const nodeTypes: NodeTypes = useMemo(() => getNodeTypes(), []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setProgramId(event.target.value);
  };

  console.log('full relationship canvas',fullRelationship  );

  const handleDisplay = useCallback(async () => {
    const fetchIDL = async () => {
      console.log("Program ID: ", programId);
      const idl = await getAnchorIDL(connection, programId);
      return parseProgram(idl);
    };
    const fetchAccountInfo = async (address: string, programDto : ProgramDTO) => {
      const info = await getAccountInfo(connection, address);
      const allAccounts = await getCreatedAccounts(connection, programId, programDto.data.accounts, programDto.data.types);

      console.log('allAccounts',allAccounts);
      console.log('canvas fullRelationship',fullRelationship);

      console.log('account',info);
      return info;
    }

    
    const origin = {x: 20, y: 20};
    
    const programDto: ProgramDTO = await fetchIDL();
    
    const accountInfo = await fetchAccountInfo(programId,programDto);


    let nodesToDisplay: Node[] = [];
    let edgesToDisplay: Edge[] = [];

    console.log('full relationship canvas',fullRelationship  );

    if (programDto) {
      onDeleteAll();

      const createNode = (type: string, position: { x: number; y: number }, name: string, index: number, entities?: InstructionDTO[] | TypeDTO[]): string | undefined => {
        const newItem = createItem(type, index, name, entities);
        if (newItem) {
          const newNode = newItem.toNode(position);
          nodesToDisplay.push(newNode);
          return newItem.id
        }
        return undefined;
      };

      const createEdge = (source: string, target: string) => {
        const newEdge: Edge = {
          id: `${source}-${target}`,
          source: source,
          target: target,
          type: 'solana',
          animated: false,
          style: { stroke: '#CCCCCC', cursor: 'pointer', strokeWidth: 1 },
          markerEnd: {
            type: MarkerType.Arrow,
            color: '#CCCCCC',
            strokeWidth: 2,
          },
        };
        edgesToDisplay.push(newEdge);
      };


      console.log('full relationship canvas',fullRelationship  );


      const programNodeId = createNode('program', origin, programDto.name || shortenAddress(programDto.data.address,),1);

      const spaceBetweenNodes = 50;
      const offsetColumn=50;

      // Create new nodes for accounts and instructions
      let nodeIdToWire;

      const instructions = programDto.data.instructions;
      const accounts = programDto.data.accounts;
      const types = programDto.data.types;

      const accounttypes = accounts.map((account, index) => {
        return {
          account,
          type: types[index]
        }
      });

      accounttypes.forEach((acct, index) => {
        nodeIdToWire = createNode('account', { x: offsetColumn + 110, y: origin.y + index * 
        spaceBetweenNodes }, acct.account.name, index,[acct.type]);

        programNodeId && nodeIdToWire && createEdge(programNodeId, nodeIdToWire);

      });

      instructions.forEach((instruction, index) => {
        nodeIdToWire = createNode('instruction', { x: offsetColumn + 300, y: origin.y + index * spaceBetweenNodes}, instruction.name, index, [instruction]);

        // Wire the nodes
        programNodeId && nodeIdToWire && createEdge(programNodeId, nodeIdToWire);
      });

      console.log('full relationship canvas',fullRelationship  );


      // combine instructions and accounts
      if (fullRelationship) {
        console.log('fullRelationship combing instructions and accounts');
        instructions.forEach((instruction, index) => {
          const instructionNode = nodesToDisplay.find((node) => node.data.item.name === instruction.name);
          const accounts = instruction.accounts;
          accounts.forEach((account) => {
            const accountNode = nodesToDisplay.find((node) => node.data.item.name === account.name);
            instructionNode && accountNode && createEdge(instructionNode.id, accountNode.id);
          });
        });
      }




      onNewSetOfNodes(nodesToDisplay);
      onNewSetOfEdges(edgesToDisplay);
    }
  }, [connection, programId, onNodesChange, onEdgesChange, onAddNode, fullRelationship]);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('text');
      const canvasRect = canvasRef.current?.getBoundingClientRect();

      if (canvasRect) {
        const position = {
          x: event.clientX - canvasRect.left,
          y: event.clientY - canvasRect.top,
        };

        const newItem = createItem(type, nodes.length);
        if (newItem) {
          const newNode = newItem.toNode(position);
          onAddNode(newNode);
        }
      }
    },
    [onAddNode, nodes.length]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onSelectNode(node);
    },
    [onSelectNode]
  );

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      onSelectEdge(edge);
    },
    [onSelectEdge]
  );
  

  const onPaneClick = useCallback(() => {
    onSelectNode(null);
    onSelectEdge(null);
  }, [onSelectNode, onSelectEdge]);

  return (
    <Box
      ref={canvasRef}
      flex={1}
      height='100%'
      width='100%'
      onDrop={onDrop}
      onDragOver={(event) => event.preventDefault()}
    >
    <Flex justifyContent='center' alignItems='center'>
      <Flex mb={4} p={2} alignItems='center'>
        <Input
          placeholder='Enter Program ID'
          value={programId}
          onChange={handleInputChange}
          width='300px'
        />
        <Button onClick={handleDisplay} ml={2}>Display</Button>
      </Flex>
    </Flex>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </Box>
  );
};

export default Canvas;