import getAccountInfo from '@/utils/getAccountInfo';
import getAnchorIDL from '@/utils/getAnchorIDL';
import getCreatedAccounts from '@/utils/getCreatedAccounts';
import { AccountDTO, InstructionDTO, ProgramDTO, parseProgram } from '@/utils/idleParser';
import shortenAddress from '@/utils/shortenAddress';
import { Box, Button, Flex, Input } from '@chakra-ui/react';
import { useConnection } from '@solana/wallet-adapter-react';
import React, { useCallback, useMemo, useRef, useState } from 'react';
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
}) => {
  const [programId, setProgramId] = useState<string>('');

  const canvasRef = useRef<HTMLDivElement>(null);
  const { connection } = useConnection();

  // Memoize nodeTypes
  const nodeTypes: NodeTypes = useMemo(() => getNodeTypes(), []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    //Pha5A3BB4xKRZDs8ycvukFUagaKvk3AQBaH3J5qwAok
    setProgramId(event.target.value);
  };

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

      console.log('account',info);
      return info;
    }

    
    const origin = {x: 20, y: 20};
    
    const programDto: ProgramDTO = await fetchIDL();
    
    const accountInfo = await fetchAccountInfo(programId,programDto);


    let nodesToDisplay: Node[] = [];
    let edgesToDisplay: Edge[] = [];

    if (programDto) {
      onDeleteAll();

      const createNode = (type: string, position: { x: number; y: number }, name: string, index: number, entities?: InstructionDTO[] | AccountDTO[]): string | undefined => {
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


      const programNodeId = createNode('program', origin, programDto.name || shortenAddress(programDto.data.address,),1);

      const spaceBetweenNodes = 50;
      const offsetColumn=50;

      // Create new nodes for accounts and instructions
      let nodeIdToWire;


      const instructions = programDto.data.instructions;
      const accounts = programDto.data.accounts;

      accounts.forEach((account, index) => {
        nodeIdToWire = createNode('account', { x: offsetColumn + 110, y: origin.y + index * 
        spaceBetweenNodes }, account.name, index,[account]);

        programNodeId && nodeIdToWire && createEdge(programNodeId, nodeIdToWire);

      });

      instructions.forEach((instruction, index) => {
        nodeIdToWire = createNode('instruction', { x: offsetColumn + 300, y: origin.y + index * spaceBetweenNodes}, instruction.name, index, [instruction]);

        // Wire the nodes
        programNodeId && nodeIdToWire && createEdge(programNodeId, nodeIdToWire);
      });

      onNewSetOfNodes(nodesToDisplay);
      onNewSetOfEdges(edgesToDisplay);
    }
  }, [connection, programId, onNodesChange, onEdgesChange, onAddNode]);

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
    [onAddNode]
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
      <Flex mb={4} p={2}>
        <Input
          placeholder='Enter Program ID'
          value={programId}
          onChange={handleInputChange}
          width='300px'
          marginLeft='216px' // Ensure it appears after the edge of the Toolbox
        />
        <Button onClick={handleDisplay}>Display</Button>
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
