# Getting Started

Welcome to your new project.

It contains these folders and files, following our recommended project layout:

File or Folder | Purpose
---------|----------
`app/` | content for UI frontends goes here
`db/` | your domain models and data go here
`srv/` | your service models and code go here
`package.json` | project metadata and configuration
`readme.md` | this getting started guide


## Next Steps

- Open a new terminal and run `cds watch`
- (in VS Code simply choose _**Terminal** > Run Task > cds watch_)
- Start adding content, for example, a [db/schema.cds](db/schema.cds).


## Learn More

Learn more at https://cap.cloud.sap/docs/get-started/.


kill $(lsof -t -i:"port number")

{
          "name": "Route",
          "pattern": "Books",
          "target":[
            "TargetBooks"
          ]
        },
        {
          "name": "RouteUsers",
          "pattern": "Users",
          "target":[
            "TargetUsers"
          ]
        }

"TargetBooks":{
          "viewType" : "XML",
          "transition": "slide",
          "clearControlAggregation" : false,
          "viewId" : "Books",
          "viewName":"Books"
        },
        "TargetUsers" : {
          "viewType" : "XML",
          "transition": "slide",
          "clearControlAggregation" : false,
          "viewId" : "Users",
          "viewName":"Users"
        }


else if (oUser === "User" && oPwd === "user@123") {
                    this.getOwnerComponent().getRouter().navTo("RouteSingleUserPage")
                }