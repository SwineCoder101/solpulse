import { Connection, Edge } from "react-flow-renderer";

export interface CanvasProps {
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