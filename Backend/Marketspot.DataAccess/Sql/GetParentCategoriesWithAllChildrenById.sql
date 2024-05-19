WITH RECURSIVE CategoryHierarchy AS (
    SELECT  "Id", "ParentId", "Name"
    FROM public."Categories" d
    WHERE "Id" = {0}
    UNION ALL
    SELECT c."Id", c."ParentId", c."Name"
    FROM public."Categories" c
    INNER JOIN CategoryHierarchy ch ON c."ParentId" = ch."Id"
)
SELECT "Id", "ParentId", "Name"
FROM CategoryHierarchy;