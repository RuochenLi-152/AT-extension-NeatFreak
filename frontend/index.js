import {
    initializeBlock,
    useBase,
    useRecords,
    TablePickerSynced,
    FieldPickerSynced,
    Button,
    Box,
    Text,
    useGlobalConfig
} from '@airtable/blocks/ui';
import React, { useMemo } from 'react';

function NeatFreakApp() {
    const base = useBase();
    const globalConfig = useGlobalConfig();
    const tableId = globalConfig.get('selectedTableId');
    const fieldId = globalConfig.get('selectedFieldId');

    const table = base.getTableByIdIfExists(tableId);
    const field = table?.getFieldByIdIfExists(fieldId);

    const records = useRecords(table);

    const isValid = table && field && field.type === 'multipleSelects';

    const sortOptions = async () => {
        if (!isValid) return;

        const optionsOrder = field.options.choices.map(choice => choice.name);

        for (let record of records) {
            const current = record.getCellValue(field);
            if (Array.isArray(current)) {
                const sorted = [...current].sort((a, b) =>
                    optionsOrder.indexOf(a.name) - optionsOrder.indexOf(b.name)
                );
                await table.updateRecordAsync(record.id, {
                    [field.id]: sorted
                });
            }
        }

        alert('🎉 Done tidying up!');
    };

    return (
        <Box padding={3}>
            <Text fontSize={4} marginBottom={2}>
                🧼 Welcome to NeatFreak!
            </Text>

            <Text>Select a table:</Text>
            <TablePickerSynced globalConfigKey="selectedTableId" />

            {table && (
                <>
                    <Text marginTop={3}>Select a multiple-select field:</Text>
                    <FieldPickerSynced
                        table={table}
                        globalConfigKey="selectedFieldId"
                        allowedTypes={['multipleSelects']}
                    />
                </>
            )}

            {isValid && (
                <Button
                    marginTop={4}
                    onClick={sortOptions}
                    icon="sort"
                    variant="primary"
                >
                    Sort Selected Options
                </Button>
            )}
        </Box>
    );
}

initializeBlock(() => <NeatFreakApp />);
