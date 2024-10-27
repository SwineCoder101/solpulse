// src/utils/itemFactory.ts

import { NodeTypes } from 'react-flow-renderer';
import { ToolboxItem } from '../interfaces/ToolboxItem';
import { Account } from '../items/Account';
import { Instruction } from '../items/Instruction';
import { Program } from '../items/Program';
import { memo } from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import { AccountDTO, formatAccountContent, formatInstructionContent, InstructionDTO } from './idleParser';

export function createItem(type: string, index: number,name? :string, entities?: InstructionDTO[] | AccountDTO[]): ToolboxItem | null {
  let content = ''; 
  switch (type) {
    case 'account':
      content = formatAccountContent(entities as AccountDTO[]);
      return new Account(`account-${index}`, name || 'New Account', '', content || '');
    case 'instruction':
      content = formatInstructionContent(entities as InstructionDTO[]);
      return new Instruction(
        `instruction-${index}`,
        name || 'New Instruction',
        '',
        content || '',
        '',
      );
    case 'program':
      return new Program(`program-${index}`, name || 'New Program', '');
    default:
      return null;
  }
}

const createNodeComponent = (defaultStyle: React.CSSProperties) =>
  memo(({ data, selected }: NodeProps) => {
    const style = {
      ...defaultStyle,
      boxShadow: selected ? '0 0 0 2px #aaa' : 'none',
    };

    return (
      <div style={style}>
        <Handle type='target' position={Position.Left} />
        <Handle type='source' position={Position.Right} />

        <div>{data.label}</div>
      </div>
    );
  });

export const getNodeTypes = (): NodeTypes => ({
  account: createNodeComponent({
    background: 'lavender',
    padding: 10,
    borderRadius: 5,
  }),
  instruction: createNodeComponent({
    border: '2px solid green',
    padding: 10,
    borderRadius: 5,
  }),
  program: createNodeComponent({
    background: 'red',
    color: 'white',
    padding: 10,
    borderRadius: 5,
  }),
});
